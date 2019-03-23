namespace Calc.Models
{
    public class Point
    {
        public virtual int PointId { get; set; }
        public string Name { get; set; }
        public double HorizontalDisplacement { get; set; }
        public double VerticalDisplacement { get; set; }

        public override bool Equals(object obj)
        {
            var point = obj as Point;
            if (point == null)
            {
                return false;
            }

            return point.PointId == this.PointId && point.HorizontalDisplacement == this.HorizontalDisplacement &&
                point.VerticalDisplacement == this.VerticalDisplacement;
        }

        public override int GetHashCode()
        {
            return ((this.PointId << 2) * this.HorizontalDisplacement * this.VerticalDisplacement).GetHashCode();
        }
    }
}