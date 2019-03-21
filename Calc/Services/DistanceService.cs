using Calc.Models;
using GeoCoordinatePortable;

namespace Calc
{
    public class DistanceService
    {
        public virtual double GetDistance(Point startingPoint, Point endingPoint)
        {
            var sCoord = new GeoCoordinate(startingPoint.HorizontalDisplacement, startingPoint.VerticalDisplacement);
            var eCoord = new GeoCoordinate(endingPoint.HorizontalDisplacement, endingPoint.VerticalDisplacement);
            return sCoord.GetDistanceTo(eCoord);
        }
    }
}