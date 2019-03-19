using Calc;
using Moq;
using NUnit.Framework;

namespace CalcTests
{
    public class ClusteringSummaryServiceTest
    {
        [Test]
        public void GetClusteringSummariesTest()
        {
            var clusteringSummaryService = new ClusteringSummaryService(new DistanceService());
            var distanceService = new Mock<DistanceService>();
            distanceService.Setup(d => d.GetDistance()).
        }

        [Test]
        public void GetInterclusterDistanceTest()
        {
            
        }

        [Test]
        public void GetAverageDistanceToCenterTest()
        {
            
        }

        [Test]
        public void GetIntraclusterDistancesTest()
        {
            
        }
    }
}