using System.Collections.Generic;

namespace Web.Services
{
        public class ClusteringSummaryDto
        {
            public int ClusterCount { get; set; }
            public string InterclusterDistance { get; set; }
            public IEnumerable<IntraclusterDistanceDto> IntraclusterDistances { get; set; }
            public string AverageClusterSize { get; set; }
        }
}