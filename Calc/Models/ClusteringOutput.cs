using System.Collections.Generic;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class ClusteringOutput
    {
        public IEnumerable<AgglomerativeHierarchicalClusterPoint> AgglomerativeHierarchicalClusterPoints { get; set; }
        public IEnumerable<ClusteringSummary> ClusteringSummaries { get; set; }
    }
}