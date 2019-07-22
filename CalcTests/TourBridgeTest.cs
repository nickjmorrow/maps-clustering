using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Services;
using NUnit.Framework;

namespace CalcTests
{
    public class TourBridgeTest
    {
        [Test]
        public void GetVerticesTest()
        {
            var points = new List<Point>
            {
                new Point
                {
                    PointId = 1,
                    HorizontalDisplacement = 2,
                    VerticalDisplacement = 3
                },
                new Point
                {
                    PointId = 2,
                    HorizontalDisplacement = 3,
                    VerticalDisplacement = 4
                }
            };
            var vertices = TourBridge.GetVertices(points).ToList();
            var expectedVertices = new List<int>()
            {
                0, 1
            };
            Assert.AreEqual(expectedVertices, vertices);
        }

        [Test]
        public void GetMatrixTest()
        {
            var points = new List<Point>
            {
                new Point
                {
                    PointId = 1,
                    HorizontalDisplacement = 0,
                    VerticalDisplacement = 0
                },
                new Point
                {
                    PointId = 2,
                    HorizontalDisplacement = 0,
                    VerticalDisplacement = 1
                },
                new Point
                {
                    PointId = 3,
                    HorizontalDisplacement = 0,
                    VerticalDisplacement = 3
                }
            };

            var expectedDistances = new double[3, 3];
            
            expectedDistances[0, 0] = 0;
            expectedDistances[0, 1] = 1;
            expectedDistances[0, 2] = 9;
            expectedDistances[1, 0] = 1;
            expectedDistances[1, 1] = 0;
            expectedDistances[1, 2] = 4;
            expectedDistances[2, 0] = 9;
            expectedDistances[2, 1] = 4;
            expectedDistances[2, 2] = 0;
            var distances = TourBridge.GetMatrix(points);
            Assert.AreEqual(expectedDistances, distances);
        }

        [Test]
        public void GetPointsTest()
        {
            var unorderedPoints = new List<Point>
            {
                new Point
                {
                    PointId = 1,
                    HorizontalDisplacement = 1,
                    VerticalDisplacement = 1
                },
                new Point
                {
                    PointId = 2,
                    HorizontalDisplacement = 2,
                    VerticalDisplacement = 2
                }
            };
            var vertices = new List<int> {1, 0};
            var expectedPoints = new List<Point> {unorderedPoints[1], unorderedPoints[0]};
            var points = TourBridge.GetPoints(unorderedPoints, vertices);
            Assert.AreEqual(expectedPoints, points);
        }
    }
}