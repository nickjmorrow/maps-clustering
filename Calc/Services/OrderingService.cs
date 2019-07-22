using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;
using Calc.Services;

namespace Calc
{
    public class OrderingService
    {
        private const int MaxClusterSize = 10;
        private readonly TourBridge _tourBridge;

        public OrderingService(TourBridge tourBridge)
        {
            this._tourBridge = tourBridge;
        }

        public IEnumerable<OrderedPoint> OrderPoints(IEnumerable<ClusteredPoint> clusteredPoints)
        {
            var maxClusterCount = clusteredPoints.First().ClusterSnapshots.Count();
            var clusterCounts = Enumerable.Range(1, maxClusterCount);

            var initialOrderedPoints = clusteredPoints.Select(cp => new OrderedPoint
            {
                PointId = cp.PointId,
                ClusterSnapshots = cp.ClusterSnapshots,
                Name = cp.Name,
                HorizontalDisplacement = cp.HorizontalDisplacement,
                VerticalDisplacement = cp.VerticalDisplacement,
                OrderingSnapshots = new List<OrderingSnapshot>()
            });
            
            // iterate through clusterCounts
            foreach (var clusterCount in clusterCounts)
            {
                // get the clusters associated with some clusterCount
                var clusterPoints = clusteredPoints.Select(cp =>
                {
                    return new ClusterPoint
                    {
                        PointId = cp.PointId,
                        HorizontalDisplacement = cp.HorizontalDisplacement,
                        VerticalDisplacement = cp.VerticalDisplacement,
                        Name = cp.Name,
                        ClusterId = cp.ClusterSnapshots.First(cs => cs.ClusterCount == clusterCount).ClusterId
                    };
                });

                // attach an orderId to each of the points comprising the clusters
                var clusteredOrderedPoints = this.GetClusteredOrderedPoints(clusterPoints);

                // TODO: clean this up
                // how to make it clearer, ideally use less mutation
                foreach (var clusteredOrderedPoint in clusteredOrderedPoints)
                {
                    // add the ordering snapshot to the orderedPoint
                    var existingPoint = initialOrderedPoints
                        .Single(iop => iop.PointId == clusteredOrderedPoint.PointId);
                    var newOrderingSnapshots = existingPoint
                        .OrderingSnapshots
                        .Append(new OrderingSnapshot
                        {
                            ClusterCount = clusterCount,
                            ClusterId = clusteredOrderedPoint.ClusterId,
                            OrderId = clusteredOrderedPoint.OrderId
                        })
                        .ToList();

                    existingPoint.OrderingSnapshots = newOrderingSnapshots;

                    initialOrderedPoints = initialOrderedPoints.Select(iop =>
                        iop.PointId == existingPoint.PointId ? new OrderedPoint
                        {
                            PointId = iop.PointId,
                            Name = iop.Name,
                            HorizontalDisplacement = iop.HorizontalDisplacement,
                            VerticalDisplacement = iop.VerticalDisplacement,
                            ClusterSnapshots = iop.ClusterSnapshots,
                            OrderingSnapshots = newOrderingSnapshots
                        } : new OrderedPoint
                        {
                            PointId = iop.PointId,
                            Name = iop.Name,
                            HorizontalDisplacement = iop.HorizontalDisplacement,
                            VerticalDisplacement = iop.VerticalDisplacement,
                            ClusterSnapshots = iop.ClusterSnapshots,
                            OrderingSnapshots = iop.OrderingSnapshots
                        });
                }
            }

            return initialOrderedPoints;
        }

        /// <summary>
        /// Given a list of clusteredPoints, return the clusteredPoints with the
        /// orderId attached. 
        /// </summary>
        /// <param name="clusterPoints"></param>
        /// <returns></returns>
        private IEnumerable<ClusteredOrderedPoint> GetClusteredOrderedPoints(IEnumerable<ClusterPoint> clusterPoints)
        {
            var clusterIds = clusterPoints.Select(cp => cp.ClusterId).Distinct();
            return clusterIds.Select(clusterId =>
            {
                var specificClusterPoints = clusterPoints.Where(cp => cp.ClusterId == clusterId);
                var orderPoints = this.GetOrderPoints(specificClusterPoints);
                return orderPoints.Select(op => new ClusteredOrderedPoint
                {
                    PointId = op.PointId,
                    ClusterId = clusterId,
                    HorizontalDisplacement = op.HorizontalDisplacement,
                    VerticalDisplacement = op.VerticalDisplacement,
                    Name = op.Name,
                    OrderId = op.OrderId
                });
            }).SelectMany(cp => cp);
        }

        /// <summary>
        /// Given a list of points, return the points, each with an orderId.
        /// </summary>
        /// <param name="points"></param>
        /// <returns></returns>
        private IEnumerable<OrderPoint> GetOrderPoints(IEnumerable<Point> points)
        {
            if (points.Count() > MaxClusterSize)
            {
                return points.Select((p, i) => new OrderPoint()
                {
                    PointId = p.PointId,
                    Name = p.Name,
                    HorizontalDisplacement = p.HorizontalDisplacement,
                    VerticalDisplacement = p.VerticalDisplacement,
                    OrderId = i
                });
            }
            var vertices = TourBridge.GetVertices(points);
            var matrix = TourBridge.GetMatrix(points);
            
            var tourProvider = new TourProvider(vertices, matrix);
            var solvedVertices = tourProvider.Solve();
            var orderedPoints = TourBridge.GetPoints(points, solvedVertices);
            return orderedPoints.Select((p, i) => new OrderPoint()
            {
                PointId = p.PointId,
                Name = p.Name,
                HorizontalDisplacement = p.HorizontalDisplacement,
                VerticalDisplacement = p.VerticalDisplacement,
                OrderId = i
            });
        }
    }
}