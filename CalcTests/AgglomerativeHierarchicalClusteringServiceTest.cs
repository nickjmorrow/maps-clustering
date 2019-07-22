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
        private readonly DistanceService _distanceService  = new FakeDistanceService();
        
        [Test]
        public void GetModelTest()
        {
            var firstPoint = new Point {PointId = 1, HorizontalDisplacement = 0, VerticalDisplacement = 0};
            var secondPoint = new Point {PointId = 2, HorizontalDisplacement = 0, VerticalDisplacement = 2};
            var thirdPoint = new Point {PointId = 3, HorizontalDisplacement = 3, VerticalDisplacement = 3};

            var firstModeledPoint = new ClusteredPoint
            {
                PointId  = firstPoint.PointId,
                HorizontalDisplacement = firstPoint.HorizontalDisplacement,
                VerticalDisplacement = firstPoint.VerticalDisplacement,
                ClusterSnapshots = new List<ClusterSnapshot>
                {
                    new ClusterSnapshot
                       {
                        ClusterId = 1,
                        ClusterCount = 3
                    },
                    new ClusterSnapshot
                    {
                        ClusterId = 1,
                        ClusterCount = 2
                    },
                    new ClusterSnapshot
                    {
                        ClusterId = 1,
                        ClusterCount = 1
                    },
                }
            };
            
            var secondModeledPoint = new ClusteredPoint
            {
                PointId = secondPoint.PointId,
                HorizontalDisplacement = secondPoint.HorizontalDisplacement,
                VerticalDisplacement = secondPoint.VerticalDisplacement,
                ClusterSnapshots = new List<ClusterSnapshot>
                {
                    new ClusterSnapshot
                    {
                        ClusterId = 2,
                        ClusterCount = 3
                    },
                    new ClusterSnapshot
                    {
                        ClusterId = 1,
                        ClusterCount = 2
                    },
                    new ClusterSnapshot
                    {
                        ClusterId = 1,
                        ClusterCount = 1
                    },
                }
            };
            
            var thirdModeledPoint = new ClusteredPoint
            {
                PointId = thirdPoint.PointId,
                HorizontalDisplacement = thirdPoint.HorizontalDisplacement,
                VerticalDisplacement = thirdPoint.VerticalDisplacement,
                ClusterSnapshots = new List<ClusterSnapshot>
                {
                    new ClusterSnapshot
                    {
                        ClusterId = 3,
                        ClusterCount = 3
                    },
                    new ClusterSnapshot
                    {
                        ClusterId = 3,
                        ClusterCount = 2
                    },
                    new ClusterSnapshot
                    {
                        ClusterId = 1,
                        ClusterCount = 1
                    },
                }
            };
            
            var modeledPoints = new AgglomerativeHierarchicalClusteringService(this._distanceService).GetModel(new List<Point>
            {
                firstPoint, secondPoint, thirdPoint
            });
            var expectedModeledPoints = new List<ClusteredPoint>
            {
                firstModeledPoint, secondModeledPoint, thirdModeledPoint
            };
            Assert.IsTrue(ListComparer.Compare(modeledPoints, expectedModeledPoints));
        }
        
        [Test]
        public void RecordClustersTest()
        {
            var firstPoint = new ClusteredPoint
            {
                PointId = 1,
                HorizontalDisplacement = 2,
                VerticalDisplacement = 3,
                ClusterSnapshots = new List<ClusterSnapshot>
                {
                    new ClusterSnapshot()
                    {
                        ClusterCount = 2,
                        ClusterId = 1
                    }
                }
            };
            var secondPoint = new ClusteredPoint()
            {
                PointId = 2,
                HorizontalDisplacement = 4,
                VerticalDisplacement = 5,
                ClusterSnapshots = new List<ClusterSnapshot>
                {
                    new ClusterSnapshot()
                    {
                        ClusterCount = 3,
                        ClusterId = 2
                    }
                }
            };
            var thirdPoint = new ClusteredPoint
            {
                PointId = 3,
                HorizontalDisplacement = 6,
                VerticalDisplacement = 7,
                ClusterSnapshots = new List<ClusterSnapshot>
                {
                    new ClusterSnapshot
                    {
                        ClusterCount = 4,
                        ClusterId = 1
                    }
                }
            };
            
            var clusters = new List<Cluster<ClusteredPoint>>
            {
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 1,
                    Points = new List<ClusteredPoint>
                    {
                        firstPoint, secondPoint   
                        
                    }
                },
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 2,
                    Points = new List<ClusteredPoint>
                    {
                        thirdPoint
                    }
                }
            };

            var actualRecordedClusters = AgglomerativeHierarchicalClusteringService.RecordClusters(clusters);
            var recordedFirstPoint = firstPoint.GetShallowCopy();
            var recordedSecondPoint = secondPoint.GetShallowCopy();
            var recordedThirdPoint = thirdPoint.GetShallowCopy();

            recordedFirstPoint.ClusterSnapshots.Append(new ClusterSnapshot
            {
                ClusterId = 1,
                ClusterCount = 3
            });

            recordedSecondPoint.ClusterSnapshots.Append(new ClusterSnapshot
            {
                ClusterId = 2,
                ClusterCount = 3
            });

            recordedThirdPoint.ClusterSnapshots.Append(new ClusterSnapshot
            {
                ClusterId = 2,
                ClusterCount = 3
            });
            
            var expectedRecordedClusters = new List<Cluster<ClusteredPoint>>
            {
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 1,
                    Points = new List<ClusteredPoint>
                    {
                        recordedFirstPoint, recordedSecondPoint   
                        
                    }
                },
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 2,
                    Points = new List<ClusteredPoint>
                    {
                        recordedThirdPoint
                    }
                }
            };
            
            Assert.IsTrue(ListComparer.Compare(actualRecordedClusters, expectedRecordedClusters));
        }
        
        [Test]
        public static void MergeClusterTest()
        {
            var firstCluster = new Cluster<ClusteredPoint>
            {
                ClusterId = 1,
                Points = new List<ClusteredPoint>
                {
                    new ClusteredPoint
                    {
                        PointId = 10,
                        HorizontalDisplacement = 1,
                        VerticalDisplacement = 2
                    }
                }
            };
            var secondCluster = new Cluster<ClusteredPoint>
            {
                ClusterId = 2,
                Points = new List<ClusteredPoint>
                {
                    new ClusteredPoint
                    {
                        PointId = 20,
                        HorizontalDisplacement = 3,
                        VerticalDisplacement = 4
                    }
                }
            };
            var thirdCluster = new Cluster<ClusteredPoint>
            {
                ClusterId = 3,
                Points = new List<ClusteredPoint>
                {
                    new ClusteredPoint
                    {
                        PointId = 30,
                        HorizontalDisplacement = 5,
                        VerticalDisplacement = 6
                    }
                }
            };
            var clusters = new List<Cluster<ClusteredPoint>>
            {
                firstCluster, secondCluster, thirdCluster
            };

            var mergedClusters = AgglomerativeHierarchicalClusteringService
                    .MergeClusters<Cluster<ClusteredPoint>, ClusteredPoint>(clusters,
                        secondCluster, thirdCluster)
                    .ToList();

            var expectedMergedClusters = new List<Cluster<ClusteredPoint>>
            {
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 1,
                    Points = new List<ClusteredPoint>
                    {
                        new ClusteredPoint
                        {
                            PointId = 10,
                            HorizontalDisplacement = 1,
                            VerticalDisplacement = 2
                        }
                    }
                },
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 2,
                    Points = new List<ClusteredPoint>
                    {
                        new ClusteredPoint
                        {
                            PointId = 20,
                            HorizontalDisplacement = 3,
                            VerticalDisplacement = 4
                        },
                        new ClusteredPoint
                        {
                            PointId = 30,
                            HorizontalDisplacement = 5,
                            VerticalDisplacement = 6
                        }
                    }
                }
            };

            Assert.IsTrue(ListComparer.Compare(mergedClusters, expectedMergedClusters));
        }
        
        [Test]
        public void GetClusterDistancesTest()
        {
            var firstCluster = new Cluster<ClusteredPoint>
                {
                    ClusterId = 1,
                    Points = new List<ClusteredPoint>
                    {
                        new ClusteredPoint
                        {
                            HorizontalDisplacement = 0,
                            VerticalDisplacement = 0
                        }
                    }
                };
            var secondCluster = new Cluster<ClusteredPoint>
            {
                ClusterId = 2,
                Points = new List<ClusteredPoint>
                {
                    new ClusteredPoint
                    {
                        HorizontalDisplacement = 3,
                        VerticalDisplacement = 3
                    }
                }
            };
            var thirdCluster = new Cluster<ClusteredPoint>
            {
                ClusterId = 3,
                Points = new List<ClusteredPoint>
                {
                    new ClusteredPoint
                    {
                        HorizontalDisplacement = -1,
                        VerticalDisplacement = -2
                    }
                }
            };

            var actualClusterDistances = new AgglomerativeHierarchicalClusteringService(this._distanceService)
                .GetClusterDistances<Cluster<ClusteredPoint>, ClusteredPoint>(
                    new List<Cluster<ClusteredPoint>>
                    {
                        firstCluster, secondCluster, thirdCluster
                    }).ToList();

            var expectedClusterDistances = new List<ClusterDistance<Cluster<ClusteredPoint>, ClusteredPoint>>
            {
                new ClusterDistance<Cluster<ClusteredPoint>, ClusteredPoint>
                {
                    StartingCluster = firstCluster,
                    EndingCluster = secondCluster,
                    Distance = 4.243,
                },
                new ClusterDistance<Cluster<ClusteredPoint>, ClusteredPoint>
                {
                    StartingCluster = firstCluster,
                    EndingCluster = thirdCluster,
                    Distance = 2.236,
                },
                new ClusterDistance<Cluster<ClusteredPoint>, ClusteredPoint>
                {
                    StartingCluster = secondCluster,
                    EndingCluster = thirdCluster,
                    Distance = 6.403
                }
            };

            Assert.IsTrue(actualClusterDistances[0].Equals(expectedClusterDistances[0]));
            Assert.IsTrue(actualClusterDistances[1].Equals(expectedClusterDistances[1]));
            Assert.IsTrue(actualClusterDistances[2].Equals(expectedClusterDistances[2]));
        }

        [Test]
        public void ConvertPointsToClustersTest()
        {
            var points = new List<Point>()
            {
                new Point() {HorizontalDisplacement = 1, VerticalDisplacement = 1},
                new Point() {HorizontalDisplacement = 2, VerticalDisplacement = 3},
            };

            var actualClusters = AgglomerativeHierarchicalClusteringService.ConvertPointsToClusters(points).ToList();
            var expectedClusters = new List<Cluster<ClusteredPoint>>
            {
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 1,
                    Points = new List<ClusteredPoint>
                    {
                        new ClusteredPoint
                            {HorizontalDisplacement = 1, VerticalDisplacement = 1}
                    }
                },
                new Cluster<ClusteredPoint>
                {
                    ClusterId = 2,
                    Points = new List<ClusteredPoint>
                    {
                        new ClusteredPoint
                            {HorizontalDisplacement = 2, VerticalDisplacement = 3}
                    }
                }
            };
            
            Assert.AreEqual(expectedClusters[0].ClusterId, actualClusters[0].ClusterId);
            Assert.AreEqual(expectedClusters[1].ClusterId, actualClusters[1].ClusterId);

            Assert.AreEqual(expectedClusters[1].Points.Count(), actualClusters[1].Points.Count());
            Assert.AreEqual(expectedClusters[1].Points.ToList()[0].HorizontalDisplacement,
                actualClusters[1].Points.ToList()[0].HorizontalDisplacement);
        }
        
        [TestCase(0, 0, 0, 0, 0)]
        [TestCase(0, 0, 3, 4, 5)]
        [TestCase(-1, -2, 2, 2, 5)]
        public void DistanceTest(double firstHorizontalDisplacement,
            double firstVerticalDisplacement,
            double secondHorizontalDisplacement,
            double secondVerticalDisplacement,
            double expectedDistance)
        {
            var startingPoint = new Point
            {
                HorizontalDisplacement = firstHorizontalDisplacement,
                VerticalDisplacement = firstVerticalDisplacement
            };

            var endingPoint = new Point
            {
                HorizontalDisplacement = secondHorizontalDisplacement,
                VerticalDisplacement = secondVerticalDisplacement
            };

            var distance = this._distanceService.GetDistance(startingPoint, endingPoint);
            Assert.AreEqual(distance, expectedDistance);
        }
    }
}