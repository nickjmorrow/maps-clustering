using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class ClusteringSummaryService
    {
        private readonly DistanceService _distanceService;

        public ClusteringSummaryService(DistanceService distanceService)
        {
            this._distanceService = distanceService;
        }

        public IEnumerable<ClusteringSummary> GetClusteringSummaries(IEnumerable<ClusteredPoint> clusteredPoints)
        {
            var totalClusterCount = clusteredPoints.First().ClusterSnapshots.Count();
            
            var clusterCountToSummaries = Enumerable.Range(1, totalClusterCount).Select(currentClusterCount =>
            {
                var clusterPoints = clusteredPoints.Select(ahc =>
                {
                    var clusterSnapshot =
                        ahc.ClusterSnapshots.SingleOrDefault(ahci =>
                            ahci.ClusterCount == currentClusterCount);

                    if (clusterSnapshot == null)
                    {
                        throw new InvalidOperationException($"No clusterId found in ahcInfos for clusterCount {currentClusterCount}");
                    } 
                    return new ClusterPoint
                    {
                        ClusterId = clusterSnapshot.ClusterId,
                        HorizontalDisplacement = ahc.HorizontalDisplacement,
                        VerticalDisplacement = ahc.VerticalDisplacement,
                        PointId = ahc.PointId
                    };
                });
                var interclusterDistance = this.GetInterclusterDistance(clusterPoints);
                var intraclusterDistances = this.GetIntraclusterDistances(clusterPoints);
                var avgClusterSize = GetAverageClusterSize(clusterPoints);
                var avgIntraclusterDistance = intraclusterDistances.Average(icd => icd.Distance);
                return new ClusteringSummary
                {
                    ClusterCount = currentClusterCount,
                    InterclusterDistance = interclusterDistance,
                    AverageIntraclusterDistance = avgIntraclusterDistance,
                    AverageClusterSize = avgClusterSize,
                    IntraclusterDistances = intraclusterDistances,
                }; 
            });
            return clusterCountToSummaries;
        }
        
        internal double GetInterclusterDistance(
            IEnumerable<ClusterPoint> clusterPoints)
        {
            var clusters = clusterPoints.GroupBy(cp => cp.ClusterId);
            var clusterCenters = clusters.Select(c => new Cluster<Point>()
            {
                ClusterId = c.Key,
                Points = c
            }).Select(c => c.GetCenter());

            return this.GetAverageDistanceToCenter(clusterCenters);
        }

        internal IEnumerable<IntraclusterDistance> GetIntraclusterDistances(
            IEnumerable<ClusterPoint> clusteredPoints)
        {
            return clusteredPoints
                .GroupBy(cp => cp.ClusterId)
                .Select(c => new IntraclusterDistance()
                {
                    ClusterId = c.Key,
                    Distance = GetAverageDistanceToCenter(c)
                });
        }

        private static double GetAverageClusterSize(IEnumerable<ClusterPoint> clusterPoints)
        {
            var groupedClusters = clusterPoints.GroupBy(cp => cp.ClusterId); 
            return Convert.ToDouble(groupedClusters.Sum(gc => gc.Count())) / groupedClusters.Count();
        }
        
        private double GetAverageDistanceToCenter(IEnumerable<Point> points)
        {
            var center = new Cluster<Point>()
            {
                Points = points
            }.GetCenter();

            var totalDistanceFromPointsToCenter =
                points.Select(p => this._distanceService.GetDistance(p, center)).Sum(); 
            return totalDistanceFromPointsToCenter / points.Count();
        }
    }
}