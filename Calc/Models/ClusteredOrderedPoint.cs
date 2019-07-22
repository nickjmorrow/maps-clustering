namespace Calc.Models
{
    public class ClusteredOrderedPoint : Point
    {
        public int OrderId { get; set; }
        public int ClusterId { get; set; }
    }
}