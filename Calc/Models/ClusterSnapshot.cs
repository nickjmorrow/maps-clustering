﻿namespace Calc.Models.AgglomerativeHierarchicalClustering
{
    public class ClusterSnapshot
    {
        public int ClusterCount { get; set; }
        public int ClusterId { get; set; }

        public override bool Equals(object obj)
        {
            var clusterInfo = (ClusterSnapshot) obj;
            return clusterInfo.ClusterCount == this.ClusterCount && clusterInfo.ClusterId == this.ClusterId;
        }

        public override int GetHashCode()
        {
            return this.ClusterId.GetHashCode() * this.ClusterCount.GetHashCode();
        }
    }
}