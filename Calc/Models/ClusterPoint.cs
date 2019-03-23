namespace Calc.Models
{
    public class ClusterPoint: Point
    {
        public int ClusterId { get; set; }
        
        public override bool Equals(object obj)
        {
            var clusteredPoint = obj as ClusterPoint;
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