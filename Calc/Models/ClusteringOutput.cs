using System.Collections.Generic;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class ClusteringOutput
    {
        public IEnumerable<ClusteredPoint> ClusteredPoints { get; set; }
        public IEnumerable<ClusteringSummary> ClusteringSummaries { get; set; }
    }
}