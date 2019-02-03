using System.Collections.Generic;

namespace Calc.Models
{
    public class ClusterSummary
    {
        public int ClusterCount { get; set; }
        public IEnumerable<IntraClusterDistance> ClusterAverageDistances { get; set; }
    }
    
    public class IntraClusterDistance
    {
        public int ClusterId { get; set; }
        public double Distance { get; set; }
    }
}