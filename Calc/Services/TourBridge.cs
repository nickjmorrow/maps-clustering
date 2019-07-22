using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;

namespace Calc.Services
{
    public class TourBridge
    {
        public static IEnumerable<int> GetVertices(IEnumerable<Point> points)
        {
            var vertices = Enumerable.Range(0, points.Count());
            return vertices;
        }

        public static double[,] GetMatrix(IEnumerable<Point> points)
        {
            var initialDistances = new double[points.Count(),points.Count()];
            
            for (var i = 0; i < points.Count(); i++)
            {
                for (var j = 0; j < points.Count(); j++)
                {
                    initialDistances[i, j] = GetDistance(points.ToArray()[i], points.ToArray()[j]);
                }
            }

            return initialDistances;
        }

        public static IEnumerable<Point> GetPoints(IEnumerable<Point> unorderedPoints, IEnumerable<int> vertices)
        {
            var unorderedPointsArray = unorderedPoints.ToArray();
            return vertices.Select(v => unorderedPointsArray[v]);
        }
        
        private static double GetDistance(Point startingPoint, Point endingPoint)
        {
            return Math.Pow(endingPoint.HorizontalDisplacement - startingPoint.HorizontalDisplacement, 2)
                   + Math.Pow(endingPoint.VerticalDisplacement - startingPoint.VerticalDisplacement, 2);
        }
    }
}