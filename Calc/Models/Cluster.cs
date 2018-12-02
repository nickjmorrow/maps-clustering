using System.Collections.Generic;

namespace Calc.Models
{
    public class Cluster
    {
        public int ClusterId { get; set; }
        public IEnumerable<Point> Points { get; set; }
    }
}