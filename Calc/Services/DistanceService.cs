using Calc.Models;
using GeoCoordinatePortable;

namespace Calc
{
    public class DistanceService
    {
        public virtual double GetDistance(Point startingPoint, Point endingPoint)
        {
            var sCoordinate = new GeoCoordinate(startingPoint.VerticalDisplacement, startingPoint.HorizontalDisplacement);
            var eCoordinate = new GeoCoordinate(endingPoint.VerticalDisplacement, endingPoint.HorizontalDisplacement);
            return sCoordinate.GetDistanceTo(eCoordinate);
        }
    }
}