namespace Calc.Models
{
    public class Point
    {
        public int PointId { get; set; }
        public string Name { get; set; }
        public double HorizontalDisplacement { get; set; }
        public double VerticalDisplacement { get; set; }


        public Point()
        {
            PointId = 0;
            Name = "";
            HorizontalDisplacement = 0;
            VerticalDisplacement = 0;
        }

        public override bool Equals(object obj)
        {
            var point = (Point) obj;
            return point.PointId == this.PointId && point.HorizontalDisplacement == this.HorizontalDisplacement &&
                point.VerticalDisplacement == this.VerticalDisplacement;
        }

        public override int GetHashCode()
        {
            return ((this.PointId << 2) * this.HorizontalDisplacement * this.VerticalDisplacement).GetHashCode();
        }
    }
}