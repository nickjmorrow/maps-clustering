using System.Collections.Generic;
using System.Linq;

namespace Calc.Models
{
    public class Cluster
    {
        public int ClusterId { get; set; }
        public IEnumerable<Point> Points { get; set; }
        
        public Point GetCenter()
        {
            var horizontalCenter = this.Points.Average(p => p.HorizontalDisplacement);
            var verticalCenter = this.Points.Average(p => p.VerticalDisplacement);

            return new Point()
            {
                HorizontalDisplacement = horizontalCenter,
                VerticalDisplacement = verticalCenter
            };
        }
    }
}