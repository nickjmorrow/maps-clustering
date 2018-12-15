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