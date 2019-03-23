using Calc.Models;
using GeoCoordinatePortable;

namespace Calc
{
    public class DistanceService
    {
        public virtual double GetDistance(Point startingPoint, Point endingPoint)
        {
            var sCoord = new GeoCoordinate(startingPoint.VerticalDisplacement, startingPoint.HorizontalDisplacement);
            var eCoord = new GeoCoordinate(endingPoint.VerticalDisplacement, endingPoint.HorizontalDisplacement);
            return sCoord.GetDistanceTo(eCoord);
        }
    }
}