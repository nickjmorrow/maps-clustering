using System.Collections.Generic;

namespace Web.Services
{
        public class ClusteringSummaryModel
        {
            public int ClusterCount { get; set; }
            public string InterclusterDistance { get; set; }
            public IEnumerable<IntraclusterDistanceModel> IntraclusterDistances { get; set; }
            public string AverageIntraclusterDistance { get; set; }
            public string AverageClusterSize { get; set; }
        }
}