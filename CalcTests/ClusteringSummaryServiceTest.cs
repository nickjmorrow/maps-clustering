using System;
using System.Collections.Generic;
using Calc;
using Calc.Helpers;
using Calc.Models;
using NUnit.Framework;

namespace CalcTests
{
    public class ClusteringSummaryServiceTest
    {
        [Test]
        public void GetClusteringSummariesTest()
        {
        }

        [Test]
        public void GetInterclusterDistanceTest()
        {
            var clusteringSummaryService = new ClusteringSummaryService(new FakeDistanceService());
            var clusteredPoints = new List<ClusterPoint>()
            {
                new ClusterPoint()
                {
                    ClusterId = 1,
                    HorizontalDisplacement = 0,
                    VerticalDisplacement = 2
                },
                new ClusterPoint()
                {
                    ClusterId = 2,
                    HorizontalDisplacement = 0,
                    VerticalDisplacement = -2
                },
                new ClusterPoint()
                {
                    ClusterId = 3,
                    HorizontalDisplacement = 2,
                    VerticalDisplacement = 0
                },
                new ClusterPoint()
                {
                    ClusterId = 4,
                    HorizontalDisplacement = -3,
                    VerticalDisplacement = 0
                },
                new ClusterPoint()
                {
                    ClusterId = 4,
                    HorizontalDisplacement = -1,
                    VerticalDisplacement = 0
                }
            };
            var expectedInterclusterDistance = 2;
            var actualInterclusterDistance = clusteringSummaryService.GetInterclusterDistance(clusteredPoints);
            
            Assert.AreEqual(expectedInterclusterDistance, actualInterclusterDistance);
        }

        [Test]
        public void GetIntraclusterDistancesTest()
        {
            var clusteringSummaryService = new ClusteringSummaryService(new FakeDistanceService());
            var clusteredPoints = new List<ClusterPoint>()
            {
                new ClusterPoint()
                {
                    ClusterId = 1,
                    HorizontalDisplacement = 1,
                    VerticalDisplacement = 0
                },
                new ClusterPoint()
                {
                    ClusterId = 1,
                    HorizontalDisplacement = 3,
                    VerticalDisplacement = 0
                },
                new ClusterPoint()
                {
                    ClusterId = 2,
                    HorizontalDisplacement = 1,
                    VerticalDisplacement = 2
                },
                new ClusterPoint()
                {
                    ClusterId = 2,
                    HorizontalDisplacement = 1,
                    VerticalDisplacement = 4
                },
                new ClusterPoint()
                {
                    ClusterId = 2,
                    HorizontalDisplacement = 1,
                    VerticalDisplacement = 6
                },
            };

            var actualIntraclusterDistances = clusteringSummaryService.GetIntraclusterDistances(clusteredPoints);

            var expectedIntraclusterDistances = new List<IntraclusterDistance>()
            {
                new IntraclusterDistance()
                {
                    ClusterId = 1,
                    Distance = 1
                },
                new IntraclusterDistance()
                {
                    ClusterId = 2,
                    Distance = 4.0/3
                }
            };

            Assert.IsTrue(ListComparer.Compare(actualIntraclusterDistances, expectedIntraclusterDistances));
        }

        [Test]
        public void FakeDistanceServiceTest()
        {
            var ds = new FakeDistanceService();
            var start = new Point()
            {
                HorizontalDisplacement = 0,
                VerticalDisplacement = 4
            };
            var end = new Point()
            {
                HorizontalDisplacement = 3,
                VerticalDisplacement = 0
            };
            var actualDistance = ds.GetDistance(start, end);
            var expectedDistance = 5;
            Assert.AreEqual(actualDistance, expectedDistance);
        }
    }

    public class FakeDistanceService : DistanceService
    {
        public override double GetDistance(Point startingPoint, Point endingPoint)
        {
            var horizontalDifference =
                Math.Abs(startingPoint.HorizontalDisplacement - endingPoint.HorizontalDisplacement);
            var verticalDifference = Math.Abs(startingPoint.VerticalDisplacement - endingPoint.VerticalDisplacement);
            var squaredDistance = Math.Pow(horizontalDifference, 2) + Math.Pow(verticalDifference, 2);
            return Math.Pow(squaredDistance, 0.5);
        }
    }
}