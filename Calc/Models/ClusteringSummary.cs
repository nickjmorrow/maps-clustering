using System.Collections.Generic;

namespace Calc.Models
{
    public class ClusteringSummary
    {
        public int ClusterCount { get; set; }
        public double InterclusterDistance { get; set; }
        public IEnumerable<IntraclusterDistance> IntraclusterDistances { get; set; }
        public double AverageClusterSize { get; set; }  
    }
}    