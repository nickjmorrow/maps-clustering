using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;

namespace Calc
{
    public class DbscanService
    {
        public IEnumerable<ClusteredPoint> GetModel(DbscanConfig dbscanConfig)
        {
            var points = dbscanConfig.Points;
            var maximumDistanceBetweenPoints = dbscanConfig.MaximumDistanceBetweenPoints;
            var minimumPointsPerCluster = dbscanConfig.MinimumPointsPerCluster;

            var unclusteredPoints = points.Select(p => new ClusteredPoint()
            {
                PointId = p.PointId,
                HorizontalDisplacement = p.HorizontalDisplacement,
                VerticalDisplacement = p.VerticalDisplacement,
                Name = p.Name,
                ClusterId = null,
                IsVisited = false
            });
            return this.GetModelInternal(unclusteredPoints, maximumDistanceBetweenPoints, minimumPointsPerCluster);
            
            // 1. begin: pick random unvisited point
            
            // 2. then, determine whether point meets req's of being in a cluster (maxDist, minPoints)
            
                // if it does, then continue to step 3
            
                // if it doesn't, then mark it as IsVisited and repeat step 1
            
            // 3. mark the point as IsVisited, then add it and all nearby points to a cluster
            
            // 4. visit all nearby points, marking them as IsVisited and adding all of those unclustered nearby points to a cluster
            
            // 5. repeat until there are no more unvisited clustered points
            
            // 6. repeat step 1 again
            
            // continue until you find a point that could be in a cluster
            
            // add nearby points to queue
            
            // visit each point in the queue, and add any other nearby points
        }

        internal IEnumerable<ClusteredPoint> GetModelInternal(
            IEnumerable<ClusteredPoint> points, 
            int maximumDistanceBetweenPoints, 
            int minimumPointsPerCluster)
        {
            var areUnvisitedPointsUnclustered = points.Any(p => !p.ClusterId.HasValue && !p.IsVisited);
            var clusterId = 1;
            while (areUnvisitedPointsUnclustered)
            {
                points = this.
                    AssignPointsToClusters(points, maximumDistanceBetweenPoints, minimumPointsPerCluster, clusterId);
                clusterId += 1;
                areUnvisitedPointsUnclustered = points.Any(p => !p.ClusterId.HasValue && !p.IsVisited);
            }

            return points;
        }

        /// <summary>
        /// Choose an unclustered point that qualifies as a cluster and continue to assign other points to clusters
        /// until there are no more unvisited unclustered points that remain.
        /// </summary>
        public IEnumerable<ClusteredPoint> AssignPointsToClusters(
            IEnumerable<ClusteredPoint> points, 
            int maximumDistanceBetweenPoints, 
            int minimumPointsPerCluster, 
            int clusterId)
        {
            var unclusteredUnvisitedPoint = points.First(p => !p.ClusterId.HasValue && !p.IsVisited);
            var nearbyPoints = this.GetNearbyPoints(unclusteredUnvisitedPoint, points, maximumDistanceBetweenPoints);
            var pointsComprisingCluster = nearbyPoints.Concat(new List<ClusteredPoint>() { unclusteredUnvisitedPoint });

            if (pointsComprisingCluster.Count() <= minimumPointsPerCluster)
            {
                var pointsWithVisitedPoint = points.Where(p => p.PointId != unclusteredUnvisitedPoint.PointId).Concat(
                    new List<ClusteredPoint>()
                    {
                        new ClusteredPoint()
                        {
                            PointId = unclusteredUnvisitedPoint.PointId,
                            HorizontalDisplacement = unclusteredUnvisitedPoint.HorizontalDisplacement,
                            VerticalDisplacement = unclusteredUnvisitedPoint.VerticalDisplacement,
                            Name = unclusteredUnvisitedPoint.Name,
                            ClusterId = null,
                            IsVisited = true
                        }
                    });
                return this.AssignPointsToClusters(pointsWithVisitedPoint, maximumDistanceBetweenPoints, minimumPointsPerCluster,
                    clusterId);
            }
            
            
            // assign all points to a cluster
            var pointIdsComprisingCluster = pointsComprisingCluster.Select(pcc => pcc.PointId);
            var processedPointsComprisingCluster = pointsComprisingCluster.Select(pcd => new ClusteredPoint()
            {
                PointId = pcd.PointId,
                HorizontalDisplacement = pcd.HorizontalDisplacement,
                VerticalDisplacement = pcd.VerticalDisplacement,
                Name = pcd.Name,
                ClusterId = clusterId,
                IsVisited = pcd.PointId == unclusteredUnvisitedPoint.PointId
            });
            var newPoints = points.Where(p => !pointIdsComprisingCluster.Contains(p.PointId))
                .Concat(processedPointsComprisingCluster);

            return this.VisitClusteredUnvisitedPoints(newPoints, maximumDistanceBetweenPoints, minimumPointsPerCluster);
        }

        public IEnumerable<ClusteredPoint> VisitClusteredUnvisitedPoints(IEnumerable<ClusteredPoint> points, 
            int maximiumDistanceBetweenPoints, int minimumPointsPerCluster)
        {
            var clusteredUnvisitedPoint = points.FirstOrDefault(p => p.ClusterId.HasValue && !p.IsVisited);

            if (clusteredUnvisitedPoint == null)
            {
                return points;
            }
            
            var nearbyPoints = this.GetNearbyPoints(clusteredUnvisitedPoint, points, maximiumDistanceBetweenPoints);
            var pointsComprisingCluster = nearbyPoints.Concat(new List<ClusteredPoint>() { clusteredUnvisitedPoint });
            if (pointsComprisingCluster.Count() <= minimumPointsPerCluster)
            {
                var pointsWithVisitedPoint = points.Where(p => p.PointId != clusteredUnvisitedPoint.PointId).Concat(
                    new List<ClusteredPoint>()
                    {
                        new ClusteredPoint()
                        {
                            PointId = clusteredUnvisitedPoint.PointId,
                            HorizontalDisplacement = clusteredUnvisitedPoint.HorizontalDisplacement,
                            VerticalDisplacement = clusteredUnvisitedPoint.VerticalDisplacement,
                            ClusterId = clusteredUnvisitedPoint.ClusterId,
                            IsVisited = true
                        }
                    });
                return this.VisitClusteredUnvisitedPoints(pointsWithVisitedPoint, maximiumDistanceBetweenPoints,
                    minimumPointsPerCluster);
            }

            var newClusteredPoints = points
                .Where(p => nearbyPoints.Select(np => np.PointId).Contains(p.PointId))
                .Concat(nearbyPoints.Select(p =>
                    new ClusteredPoint()
                    {
                        PointId = p.PointId,
                        HorizontalDisplacement = p.HorizontalDisplacement,
                        VerticalDisplacement = p.VerticalDisplacement,
                        ClusterId = clusteredUnvisitedPoint.ClusterId,
                        IsVisited = p.IsVisited
                    }))
                .Where(p => p.PointId != clusteredUnvisitedPoint.PointId)
                .Concat(new List<ClusteredPoint>()
                {
                    new ClusteredPoint()
                    {
                        PointId = clusteredUnvisitedPoint.PointId,
                        HorizontalDisplacement = clusteredUnvisitedPoint.HorizontalDisplacement,
                        VerticalDisplacement = clusteredUnvisitedPoint.VerticalDisplacement,
                        Name = clusteredUnvisitedPoint.Name,
                        ClusterId = clusteredUnvisitedPoint.ClusterId,
                        IsVisited = true
                    }
                });
            return this.VisitClusteredUnvisitedPoints(newClusteredPoints, maximiumDistanceBetweenPoints,
                minimumPointsPerCluster);
        }

        public IEnumerable<ClusteredPoint> GetNearbyPoints(ClusteredPoint point, IEnumerable<ClusteredPoint> allPoints,
            int maximumDistanceBetweenPoints)
        {
            throw new NotImplementedException();
        }
    }
}