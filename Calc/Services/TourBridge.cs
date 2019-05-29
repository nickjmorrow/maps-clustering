using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;

namespace Calc.Services
{
    public class TourBridge
    {
        public IEnumerable<int> GetVertices(IEnumerable<Point> points)
        {
            var vertices = Enumerable.Range(0, points.Count());
            return vertices;
        }

        public double[,] GetMatrix(IEnumerable<Point> points)
        {
            var initialDistances = new double[points.Count(),points.Count()];
            
            // TODO: clean up
            for (var i = 0; i < points.Count(); i++)
            {
                for (var j = 0; j < points.Count(); j++)
                {
                    initialDistances[i, j] = this.GetDistance(points.ToArray()[i], points.ToArray()[j]);
                }
            }

            return initialDistances;
        }

        public double GetDistance(Point startingPoint, Point endingPoint)
        {
            return Math.Pow(endingPoint.HorizontalDisplacement - startingPoint.HorizontalDisplacement, 2)
                   + Math.Pow(endingPoint.VerticalDisplacement - startingPoint.VerticalDisplacement, 2);
        }

        public IEnumerable<Point> GetPoints(IEnumerable<Point> unorderedPoints, IEnumerable<int> vertices)
        {
            var unorderedPointsArray = unorderedPoints.ToArray();
            return vertices.Select(v => unorderedPointsArray[v]);
        }
    }
}