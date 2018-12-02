using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Helpers;

namespace Calc.Models
{
    public class AgglomerativeHierarchicalCluster : Cluster
    {
        public new IEnumerable<AgglomerativeHierarchicalClusterPoint> Points { get; set; }
        
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

        public override bool Equals(Object obj)
        {
            var cluster = (AgglomerativeHierarchicalCluster) obj;
            return cluster.ClusterId == this.ClusterId
                   && ListComparer.Compare(cluster.Points, this.Points);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}