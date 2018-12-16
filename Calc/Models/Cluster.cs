using System.Collections.Generic;
using System.Linq;
using Calc.Helpers;

namespace Calc.Models
{
    public class Cluster<T> where T : Point
    {
        public int ClusterId { get; set; }
        public IEnumerable<T> Points { get; set; }
        
        public Point GetCenter()
        {
            var horizontalCenter = this.Points.Average(p => p.HorizontalDisplacement);
            var verticalCenter = this.Points.Average(p => p.VerticalDisplacement);
            var point = new Point()
            {
                HorizontalDisplacement = horizontalCenter,
                VerticalDisplacement = verticalCenter
            };
            return point;
        }
        
        public override bool Equals(object obj)
        {
            var cluster = (Cluster<T>) obj;
            return cluster.ClusterId == this.ClusterId && ListComparer.Compare(cluster.Points, this.Points);
        }

        public override int GetHashCode()
        {
            return this.ClusterId.GetHashCode();
        }
    }
}