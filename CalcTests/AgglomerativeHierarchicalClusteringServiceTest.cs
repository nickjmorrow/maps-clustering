using System.Collections.Generic;
using System.Linq;
using Calc;
using Calc.Helpers;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;
using NUnit.Framework;

namespace CalcTests
{
    public class AgglomerativeHierarchicalClusteringServiceTest
    {
        [Test]
        public void GetModelTest()
        {
            var firstPoint = new Point {PointId = 1, HorizontalDisplacement = 0, VerticalDisplacement = 0};
            var secondPoint = new Point {PointId = 2, HorizontalDisplacement = 0, VerticalDisplacement = 2};
            var thirdPoint = new Point {PointId = 3, HorizontalDisplacement = 3, VerticalDisplacement = 3};

            var firstModeledPoint = new AgglomerativeHierarchicalClusterPoint()
            {
                PointId  = firstPoint.PointId,
                HorizontalDisplacement = firstPoint.HorizontalDisplacement,
                VerticalDisplacement = firstPoint.VerticalDisplacement,
                AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>()
                {
                    new AgglomerativeHierarchicalClusterInfo()
                       {
                        ClusterId = 1,
                        ClusterCount = 3
                    },
                    new AgglomerativeHierarchicalClusterInfo()
                    {
                        ClusterId = 1,
                        ClusterCount = 2
                    },
                    new AgglomerativeHierarchicalClusterInfo()
                    {
                        ClusterId = 1,
                        ClusterCount = 1
                    },
                }
            };
//            var secondModeledPoint = new AgglomerativeHierarchicalClusterPoint()
//            {
//                PointId = secondPoint.PointId,
//                HorizontalDisplacement = secondPoint.HorizontalDisplacement,
//                VerticalDisplacement = secondPoint.VerticalDisplacement,
//                AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>()
//                {
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterId = 2,
//                        ClusterCount = 3
//                    },
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterId = 1,
//                        ClusterCount = 2
//                    },
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterId = 1,
//                        ClusterCount = 1
//                    },
//                }
//            };
//            var thirdModeledPoint = new AgglomerativeHierarchicalClusterPoint()
//            {
//                PointId = thirdPoint.PointId,
//                HorizontalDisplacement = thirdPoint.HorizontalDisplacement,
//                VerticalDisplacement = thirdPoint.VerticalDisplacement,
//                AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>()
//                {
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterId = 3,
//                        ClusterCount = 3
//                    },
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterId = 3,
//                        ClusterCount = 2
//                    },
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterId = 1,
//                        ClusterCount = 1
//                    },
//                }
//            };
//            
//            var modeledPoints = new AgglomerativeHierarchicalClusteringService().GetModel(new List<Point>()
//            {
//                firstPoint, secondPoint, thirdPoint
//            });
//            var expectedModeledPoints = new List<AgglomerativeHierarchicalClusterPoint>()
//            {
//                firstModeledPoint, secondModeledPoint, thirdModeledPoint
//            };
//            Assert.IsTrue(ListComparer.Compare(modeledPoints, expectedModeledPoints));
//        }
//        
//        [Test]
//        public void RecordClustersTest()
//        {
//            var firstPoint = new AgglomerativeHierarchicalClusterPoint()
//            {
//                PointId = 1,
//                HorizontalDisplacement = 2,
//                VerticalDisplacement = 3,
//                AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>()
//                {
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterCount = 2,
//                        ClusterId = 1
//                    }
//                }
//            };
//            var secondPoint = new AgglomerativeHierarchicalClusterPoint()
//            {
//                PointId = 2,
//                HorizontalDisplacement = 4,
//                VerticalDisplacement = 5,
//                AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>()
//                {
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterCount = 3,
//                        ClusterId = 2
//                    }
//                }
//            };
//            var thirdPoint = new AgglomerativeHierarchicalClusterPoint()
//            {
//                PointId = 3,
//                HorizontalDisplacement = 6,
//                VerticalDisplacement = 7,
//                AgglomerativeHierarchicalClusterInfos = new List<AgglomerativeHierarchicalClusterInfo>()
//                {
//                    new AgglomerativeHierarchicalClusterInfo()
//                    {
//                        ClusterCount = 4,
//                        ClusterId = 1
//                    }
//                }
//            };
//            
//            var clusters = new List<Cluster<AgglomerativeHierarchicalClusterPoint>>()
//            {
//                new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 1,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        firstPoint, secondPoint   
//                        
//                    }
//                },
//                new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 2,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        thirdPoint
//                    }
//                }
//            };
//
//            var recordedClusters = new AgglomerativeHierarchicalClusteringService().RecordClusters(clusters);
//            // TODO
//            Assert.IsTrue(true);
//        }
//        
//        [Test]
//        public void MergeClusterTest()
//        {
//            var firstCluster = new Cluster<AgglomerativeHierarchicalClusterPoint>()
//            {
//                ClusterId = 1,
//                Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    new AgglomerativeHierarchicalClusterPoint()
//                    {
//                        PointId = 10,
//                        HorizontalDisplacement = 1,
//                        VerticalDisplacement = 2
//                    }
//                }
//            };
//            var secondCluster = new Cluster<AgglomerativeHierarchicalClusterPoint>()
//            {
//                ClusterId = 2,
//                Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    new AgglomerativeHierarchicalClusterPoint()
//                    {
//                        PointId = 20,
//                        HorizontalDisplacement = 3,
//                        VerticalDisplacement = 4
//                    }
//                }
//            };
//            var thirdCluster = new Cluster<AgglomerativeHierarchicalClusterPoint>()
//            {
//                ClusterId = 3,
//                Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    new AgglomerativeHierarchicalClusterPoint()
//                    {
//                        PointId = 30,
//                        HorizontalDisplacement = 5,
//                        VerticalDisplacement = 6
//                    }
//                }
//            };
//            var clusters = new List<Cluster<AgglomerativeHierarchicalClusterPoint>>()
//            {
//                firstCluster, secondCluster, thirdCluster
//            };
//
//            var mergedClusters = new
//                AgglomerativeHierarchicalClusteringService()
//                    .MergeClusters<Cluster<AgglomerativeHierarchicalClusterPoint>, AgglomerativeHierarchicalClusterPoint>(clusters,
//                        secondCluster, thirdCluster)
//                    .ToList();
//
//            var expectedMergedClusters = new List<Cluster<AgglomerativeHierarchicalClusterPoint>>()
//            {
//                new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 1,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        new AgglomerativeHierarchicalClusterPoint()
//                        {
//                            PointId = 10,
//                            HorizontalDisplacement = 1,
//                            VerticalDisplacement = 2
//                        }
//                    }
//                },
//                new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 2,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        new AgglomerativeHierarchicalClusterPoint()
//                        {
//                            PointId = 20,
//                            HorizontalDisplacement = 3,
//                            VerticalDisplacement = 4
//                        },
//                        new AgglomerativeHierarchicalClusterPoint()
//                        {
//                            PointId = 30,
//                            HorizontalDisplacement = 5,
//                            VerticalDisplacement = 6
//                        }
//                    }
//                }
//            };
//
//            Assert.IsTrue(ListComparer.Compare(mergedClusters, expectedMergedClusters));
//        }
//        
//        [Test]
//        public void GetClusterDistancesTest()
//        {
//            var firstCluster = new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 1,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        new AgglomerativeHierarchicalClusterPoint()
//                        {
//                            HorizontalDisplacement = 0,
//                            VerticalDisplacement = 0
//                        }
//                    }
//                };
//            var secondCluster = new Cluster<AgglomerativeHierarchicalClusterPoint>()
//            {
//                ClusterId = 2,
//                Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    new AgglomerativeHierarchicalClusterPoint()
//                    {
//                        HorizontalDisplacement = 3,
//                        VerticalDisplacement = 3
//                    }
//                }
//            };
//            var thirdCluster = new Cluster<AgglomerativeHierarchicalClusterPoint>()
//            {
//                ClusterId = 3,
//                Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    new AgglomerativeHierarchicalClusterPoint()
//                    {
//                        HorizontalDisplacement = -1,
//                        VerticalDisplacement = -2
//                    }
//                }
//            };
//
//            var actualClusterDistances = new AgglomerativeHierarchicalClusteringService()
//                .GetClusterDistances<Cluster<AgglomerativeHierarchicalClusterPoint>, AgglomerativeHierarchicalClusterPoint>(
//                    new List<Cluster<AgglomerativeHierarchicalClusterPoint>>()
//                    {
//                        firstCluster, secondCluster, thirdCluster
//                    }).ToList();
//
//            var expectedClusterDistances = new List<ClusterDistance<Cluster<AgglomerativeHierarchicalClusterPoint>, AgglomerativeHierarchicalClusterPoint>>()
//            {
//                new ClusterDistance<Cluster<AgglomerativeHierarchicalClusterPoint>, AgglomerativeHierarchicalClusterPoint>()
//                {
//                    StartingCluster = firstCluster,
//                    EndingCluster = secondCluster,
//                    Distance = 4.243,
//                },
//                new ClusterDistance<Cluster<AgglomerativeHierarchicalClusterPoint>, AgglomerativeHierarchicalClusterPoint>()
//                {
//                    StartingCluster = firstCluster,
//                    EndingCluster = thirdCluster,
//                    Distance = 2.236,
//                },
//                new ClusterDistance<Cluster<AgglomerativeHierarchicalClusterPoint>, AgglomerativeHierarchicalClusterPoint>()
//                {
//                    StartingCluster = secondCluster,
//                    EndingCluster = thirdCluster,
//                    Distance = 6.403
//                }
//            };
//
//            Assert.IsTrue(actualClusterDistances[0].Equals(expectedClusterDistances[0]));
//            Assert.IsTrue(actualClusterDistances[1].Equals(expectedClusterDistances[1]));
//            Assert.IsTrue(actualClusterDistances[2].Equals(expectedClusterDistances[2]));
//        }
//
//        [Test]
//        public void ConvertPointsToClustersTest()
//        {
//            var points = new List<Point>()
//            {
//                new Point() {HorizontalDisplacement = 1, VerticalDisplacement = 1},
//                new Point() {HorizontalDisplacement = 2, VerticalDisplacement = 3},
//            };
//
//            var actualClusters = new AgglomerativeHierarchicalClusteringService().ConvertPointsToClusters(points).ToList();
//            var expectedClusters = new List<Cluster<AgglomerativeHierarchicalClusterPoint>>()
//            {
//                new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 1,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        new AgglomerativeHierarchicalClusterPoint()
//                            {HorizontalDisplacement = 1, VerticalDisplacement = 1}
//                    }
//                },
//                new Cluster<AgglomerativeHierarchicalClusterPoint>()
//                {
//                    ClusterId = 2,
//                    Points = new List<AgglomerativeHierarchicalClusterPoint>()
//                    {
//                        new AgglomerativeHierarchicalClusterPoint()
//                            {HorizontalDisplacement = 2, VerticalDisplacement = 3}
//                    }
//                }
//            };
//            
//            Assert.AreEqual(expectedClusters[0].ClusterId, actualClusters[0].ClusterId);
//            Assert.AreEqual(expectedClusters[1].ClusterId, actualClusters[1].ClusterId);
//
//            Assert.AreEqual(expectedClusters[1].Points.Count(), actualClusters[1].Points.Count());
//            Assert.AreEqual(expectedClusters[1].Points.ToList()[0].HorizontalDisplacement,
//                actualClusters[1].Points.ToList()[0].HorizontalDisplacement);
//        }
//        
//        [TestCase(0, 0, 0, 0, 0)]
//        [TestCase(0, 0, 3, 4, 5)]
//        [TestCase(-1, -2, 2, 2, 5)]
//        public void DistanceTest(double firstHorizontalDisplacement,
//            double firstVerticalDisplacement,
//            double secondHorizontalDisplacement,
//            double secondVerticalDisplacement,
//            double expectedDistance)
//        {
//            var startingPoint = new Point()
//            {
//                HorizontalDisplacement = firstHorizontalDisplacement,
//                VerticalDisplacement = firstVerticalDisplacement
//            };
//
//            var endingPoint = new Point()
//            {
//                HorizontalDisplacement = secondHorizontalDisplacement,
//                VerticalDisplacement = secondVerticalDisplacement
//            };
//
//            var distance = new AgglomerativeHierarchicalClusteringService().GetDistance(startingPoint, endingPoint);
//            Assert.AreEqual(distance, expectedDistance);
        }
    }
}