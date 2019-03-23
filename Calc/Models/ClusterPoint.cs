namespace Calc.Models
{
    public class ClusteredPoint: Point
    {
        public int ClusterId { get; set; }
        
        public override bool Equals(object obj)
        {
            var clusteredPoint = obj as ClusteredPoint;
            if (clusteredPoint == null)
            {
                return false;
            }
    
            return this.PointId == clusteredPoint.PointId && this.ClusterId == clusteredPoint.ClusterId;
        }
    
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}