using System.Collections.Generic;

namespace Calc.Models
{
    public class ClusterSummary
    {
        public double InterclusterDistance { get; set; }
        public IEnumerable<IntraclusterDistance> intraclusterDistances { get; set; }
    }
}    