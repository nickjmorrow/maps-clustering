using System.Collections.Generic;
using System.Linq;

namespace Calc.Models
{
    public class Cluster<T> where T : Point
    {
        public int ClusterId { get; set; }
        public virtual IEnumerable<T> Points { get; set; }
        
        public T GetCenter()
        {
            var horizontalCenter = this.Points.Average(p => p.HorizontalDisplacement);
            var verticalCenter = this.Points.Average(p => p.VerticalDisplacement);
            var point = new Point()
            {
                HorizontalDisplacement = horizontalCenter,
                VerticalDisplacement = verticalCenter
            };
            return (T) point;
        }
    }
}