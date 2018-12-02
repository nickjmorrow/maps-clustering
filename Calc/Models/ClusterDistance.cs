using System;

namespace Calc.Models
{
    public class ClusterDistance
    {
        public AgglomerativeHierarchicalCluster StartingCluster { get; set; }
        public AgglomerativeHierarchicalCluster EndingCluster { get; set; }
        public double Distance { get; set; }

        public override bool Equals(object obj)
        {
            var clusterDistance = (ClusterDistance) obj;
            return clusterDistance.StartingCluster.ClusterId == this.StartingCluster.ClusterId
                   && clusterDistance.EndingCluster.ClusterId == this.EndingCluster.ClusterId
                   && Math.Abs(clusterDistance.Distance - this.Distance) < 0.01;
        }

        public override int GetHashCode()
        {
            return this.StartingCluster.GetHashCode() * this.EndingCluster.GetHashCode() * this.Distance.GetHashCode();
        }
    }
}