using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class ClusteringSummaryService
    {
        // TODO: consider average intracluster distance
        private DistanceService _distanceService;

        public ClusteringSummaryService(DistanceService distanceService)
        {
            this._distanceService = distanceService;
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
                var intraclusterDistances = this.GetIntraclusterDistances(clusteredPoints);
                var avgDistanceBetweenAllPoints = this.GetAverageDistanceToCenter(ahcPoints);
                clusterCountToSummaries.Add(new ClusteringSummary()
                {
                    InterclusterDistance = interclusterDistance,
                    IntraclusterDistances = intraclusterDistances,
                    AverageDistanceBetweenAllPoints = avgDistanceBetweenAllPoints
                });
            }

            return clusterCountToSummaries;
        }

        internal double GetInterclusterDistance(
            IEnumerable<ClusteredPoint> clusteredPoints)
        {
            var clusters = clusteredPoints.GroupBy(cp => cp.ClusterId);
            var clusterCenters = clusters.Select(c => new Cluster<Point>()
            {
                ClusterId = c.Key,
                Points = c
            }).Select(c => c.GetCenter());

            return this.GetAverageDistanceToCenter(clusterCenters);
        }

        internal double GetAverageDistanceToCenter(IEnumerable<Point> points)
        {
            var center = new Cluster<Point>()
            {
                Points = points
            }.GetCenter();

            var totalDistanceFromPointsToCenter =
                points.Select(p => this._distanceService.GetDistance(p, center)).Sum(); 
            return totalDistanceFromPointsToCenter / points.Count();
        }

        internal IEnumerable<IntraclusterDistance> GetIntraclusterDistances(
            IEnumerable<ClusteredPoint> clusteredPoints)
        {
            return clusteredPoints
                .GroupBy(cp => cp.ClusterId)
                .Select(c => new IntraclusterDistance()
                {
                    ClusterId = c.Key,
                    Distance = GetAverageDistanceToCenter(c)
                });
        }
    }
}