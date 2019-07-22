using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class AgglomerativeHierarchicalClusteringService
    {
        private readonly DistanceService _distanceService;

        public AgglomerativeHierarchicalClusteringService(DistanceService distanceService)
        {
            this._distanceService = distanceService;
        }

        public IEnumerable<ClusteredPoint> GetModel(IEnumerable<Point> points, 
            int minimumClusters = 1)
        {
            if (minimumClusters < 1)
            {
                throw new ArgumentException($"Minimum clusters cannot be below 1 but was {minimumClusters}");
            }
            
            // assign each point to a cluster (there are N clusters to begin with, where N = number of points)
            var initialClusters = ConvertPointsToClusters(points);

            return GetModelInternal(initialClusters, minimumClusters);
        }

        internal IEnumerable<ClusteredPoint> GetModelInternal(
            IEnumerable<Cluster<ClusteredPoint>> initialClusters, int minimumClusters)
        {
            // calculate distance between each pair of clusters by their centers
            var clusterDistances =
                GetClusterDistances<Cluster<ClusteredPoint>, ClusteredPoint>(initialClusters);
            
            // determine closest clusters
            var minimumDistance = clusterDistances.Min(cd => cd.Distance);
            var closestClusterPair = clusterDistances.FirstOrDefault(cd => cd.Distance == minimumDistance);
            
            // merge the pair
            var mergedClusters = MergeClusters<Cluster<ClusteredPoint>, ClusteredPoint>(
                initialClusters, closestClusterPair.StartingCluster,
                closestClusterPair.EndingCluster);

            // record the new clusterId of all the points at the current cluster count
            var recordedClusters = RecordClusters(mergedClusters);

            // continue until there is only clusterThreshold left
            if (recordedClusters.Count() <= minimumClusters)
            {
                return recordedClusters.SelectMany(rc => rc.Points);
            }

            return GetModelInternal(recordedClusters, minimumClusters);
        }

        internal IEnumerable<Cluster<ClusteredPoint>> RecordClusters(
            IEnumerable<Cluster<ClusteredPoint>> clusters)
        {
            var clusterCount = clusters.Count();
            return clusters.Select(c => new Cluster<ClusteredPoint>
            {
                ClusterId = c.ClusterId,
                Points = c.Points.Select(p => new ClusteredPoint
                    {
                        PointId = p.PointId,
                        Name = p.Name,
                        HorizontalDisplacement = p.HorizontalDisplacement,
                        VerticalDisplacement = p.VerticalDisplacement,
                        ClusterSnapshots = p.ClusterSnapshots.Concat(
                            new List<ClusterSnapshot>
                            {
                                new ClusterSnapshot
                                {
                                    ClusterCount = clusterCount,
                                    ClusterId = c.ClusterId
                                }
                            }
                        )
                })
            });
        }

        internal static IEnumerable<T> MergeClusters<T, U>(
            IEnumerable<T> unmergedClusters,
            T clusterOne,
            T clusterTwo) 
            where T : Cluster<U> 
            where U : Point
        {
            var primaryCluster = clusterOne.ClusterId < clusterTwo.ClusterId ? clusterOne : clusterTwo;
            var secondaryCluster = clusterOne.ClusterId < clusterTwo.ClusterId ? clusterTwo : clusterOne;
            var pointsToAdd = primaryCluster.Points.ToList().Concat(secondaryCluster.Points).ToList();

            var mergedClusters = unmergedClusters.Where(uc => uc.ClusterId != secondaryCluster.ClusterId)
                .Select(c =>
                {
                    c.Points = c.ClusterId == primaryCluster.ClusterId ? pointsToAdd : c.Points;
                    return c;
                });
            return mergedClusters;
        }

        internal IEnumerable<ClusterDistance<T, U>> GetClusterDistances<T, U>(IEnumerable<T> clusters)
            where T : Cluster<U>
            where U : Point
        {
            return clusters
                .SelectMany(c => clusters, (c1, c2) => new {c1, c2})
                .Where(c => c.c1.ClusterId != c.c2.ClusterId)
                .Select(c => new ClusterDistance<T, U>
                {
                    StartingCluster = c.c1,
                    EndingCluster = c.c2,
                    Distance = this._distanceService.GetDistance(c.c1.GetCenter(), c.c2.GetCenter())
                })
                .GroupBy(c => c.Distance)
                .Select(c => c.First());
        }
        
        internal static IEnumerable<Cluster<ClusteredPoint>> ConvertPointsToClusters(
            IEnumerable<Point> points)
        {
            var clusterCount = points.Count();
            return points.Select((p, index) => new Cluster<ClusteredPoint>()
            {
                ClusterId = index + 1,
                Points = new List<ClusteredPoint>
                {
                    new ClusteredPoint
                    {
                        HorizontalDisplacement = p.HorizontalDisplacement,
                        VerticalDisplacement = p.VerticalDisplacement,
                        PointId = p.PointId,
                        Name = p.Name,
                        ClusterSnapshots = new List<ClusterSnapshot>
                        {
                            new ClusterSnapshot
                            {
                                ClusterId = index + 1,
                                ClusterCount = clusterCount
                            }
                        }
                    }
                }
            }).ToList();
        }
    }
}