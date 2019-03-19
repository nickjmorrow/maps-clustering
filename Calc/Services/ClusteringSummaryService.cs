using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class ClusteringSummaryService
    {
        // intercluster distance
        // intracluster distance for each cluster
        // average intracluster distance
        // average distance between all points (maybe)
        private ClusteringUtilities _clusteringUtilities;

        public ClusteringSummaryService(ClusteringUtilities clusteringUtilities)
        {
            this._clusteringUtilities = clusteringUtilities;
        }

        public IEnumerable<ClusteringSummary> GetClusteringSummaries(IEnumerable<AgglomerativeHierarchicalClusterPoint> ahcPoints)
        {
            var totalClusterCount = ahcPoints.First().AgglomerativeHierarchicalClusterInfos.Count();
            var clusterCountToSummaries = new List<ClusteringSummary>();
            for (var currentClusterCount = 1; currentClusterCount <= totalClusterCount; currentClusterCount++)
            {
                var clusteredPoints = ahcPoints.Select(ahc =>
                {
                    var clusterId =
                        ahc.AgglomerativeHierarchicalClusterInfos.Single(ahci =>
                            ahci.ClusterCount == currentClusterCount).ClusterId;
                    return new ClusteredPoint()
                    {
                        ClusterId = clusterId,
                        HorizontalDisplacement = ahc.HorizontalDisplacement,
                        VerticalDisplacement = ahc.VerticalDisplacement,
                        Name = ahc.Name,
                        PointId = ahc.PointId
                    };
                });
                var interclusterDistance = this.GetInterclusterDistance(clusteredPoints);
                var intraclusterDistanceInfos = this.GetIntraclusterDistance(clusteredPoints);
                clusterCountToSummaries.Add(new ClusteringSummary()
                {
                    InterclusterDistance = interclusterDistance,
                    IntraclusterDistances = intraclusterDistanceInfos
                });
            }

            return clusterCountToSummaries;
        }

        public double GetInterclusterDistance(
            IEnumerable<ClusteredPoint> clusteredPoints)
        {
            var clusters = clusteredPoints.GroupBy(cp => cp.ClusterId);
            var clusterCenters = clusters.Select(c => new Cluster<Point>()
            {
                // TODO: wish I didn't have to null coalesce here, it should never be null
                // clusterId shouldn't be nullable
                ClusterId = c.Key ?? 0,
                Points = c
            }).Select(c => c.GetCenter());

            return this.GetAverageDistanceToCenter(clusterCenters);
        }

        public double GetAverageDistanceToCenter(IEnumerable<Point> points)
        {
            var center = new Cluster<Point>()
            {
                Points = points
            }.GetCenter();

            var totalDistanceFromPointsToCenter =
                points.Select(p => this._clusteringUtilities.GetDistance(p, center)).Sum(); 
            return totalDistanceFromPointsToCenter / points.Count();
        }

        public IEnumerable<IntraclusterDistance> GetIntraclusterDistance(
            IEnumerable<ClusteredPoint> clusteredPoints)
        {
            // break up the points into separate clusters
            
            // for each cluster, find average distance bebtween each point
            throw new NotImplementedException();
        }
    }

    public class InterclusterDistanceInfo
    {
        public int ClusterCount { get; set; }
        public double InterclusterDistance { get; set; }
    }

    public class IntraclusterDistanceInfo
    {
        public int ClusterCount { get; set; }
        public double IntraclusterDistance { get; set; }
    }
}