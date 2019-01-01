namespace Calc.Models
{
    public class ClusteredPoint: Point
    {
        public int? ClusterId { get; set; }
        public bool IsVisited { get; set; } = false;
        
        public override bool Equals(object obj)
        {
            var point = obj as Point;
            if (point == null)
            {
                return false;
            }
    
            return this.PointId == point.PointId;
        }
    
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}