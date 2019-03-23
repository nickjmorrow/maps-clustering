using System.Collections.Generic;
using Calc.Models;

namespace Calc
{
        
    public class ClusteringService
    {
        private AgglomerativeHierarchicalClusteringService _ahcService;
        private ClusteringSummaryService _clusteringSummaryService;

        public ClusteringService(AgglomerativeHierarchicalClusteringService ahcService, ClusteringSummaryService clusteringSummaryService)
        {
            this._ahcService = ahcService;
            this._clusteringSummaryService = clusteringSummaryService;
        }

        public ClusteringOutput GetClusteringOutput(IEnumerable<Point> points, 
            int minimumClusters = 1)
        {
            var agglomerativeHierarchicalClusterPoints = this._ahcService.GetModel(points, minimumClusters);
            var clusteringSummaries = this._clusteringSummaryService.GetClusteringSummaries(agglomerativeHierarchicalClusterPoints);
            return new ClusteringOutput()
            {
                AgglomerativeHierarchicalClusterPoints = agglomerativeHierarchicalClusterPoints,
                ClusteringSummaries = clusteringSummaries
            };
        }
    }
}