using System.Collections.Generic;
using Calc.Models;

namespace Calc
{
        
    public class ClusteringService
    {
        private readonly AgglomerativeHierarchicalClusteringService _ahcService;
        private readonly ClusteringSummaryService _clusteringSummaryService;
        private readonly OrderingService _orderingService;

        public ClusteringService(AgglomerativeHierarchicalClusteringService ahcService, ClusteringSummaryService clusteringSummaryService,
            OrderingService orderingService)
        {
            this._ahcService = ahcService;
            this._clusteringSummaryService = clusteringSummaryService;
            this._orderingService = orderingService;
        }

        public CalculationOutput GetCalculationOutput(IEnumerable<Point> points, 
            int minimumClusters = 1)
        {
            var clusteredPoints = this._ahcService.GetModel(points, minimumClusters);
            var clusteringSummaries = this._clusteringSummaryService.GetClusteringSummaries(clusteredPoints);
            var orderedPoints = this._orderingService.OrderPoints(clusteredPoints);
            
            return new CalculationOutput
            {
                OrderedPoints = orderedPoints,
                ClusteringSummaries = clusteringSummaries
            };
        }
    }
}