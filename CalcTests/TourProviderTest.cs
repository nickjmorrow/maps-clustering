using System;
using System.Collections.Generic;
using System.Linq;
using Calc.Services;
using NUnit.Framework;

namespace CalcTests
{
    public class TourProviderTest
    {
        [Test]
        public void SolveTest()
        {
            //Arrange
            var vertics = new int[4] { 0, 1, 2, 3 };
            var matrix = new double[4, 4]
            {
                {0, 10, 15, 20},
                {5, 0, 9, 10},
                {6, 13, 0, 12},
                {8, 8, 9, 0}
            };
            var expectedCost = 35.0;
            var expectedRoute = new int[5] { 0, 1, 3, 2, 0 };

            //Act
            var DynamicProgramming = new TourProvider(vertics, matrix);
            double cost;
            IEnumerable<int> route = DynamicProgramming.Solve(out cost);

            //Assert
            Assert.AreEqual(expectedCost, cost);
            Assert.IsTrue(CheckArraysAreEqual(expectedRoute, route.ToArray()), "Routes not equal");
        }

        private bool CheckArraysAreEqual(int[] expectedRoute, int[] actual)
        {
            if (expectedRoute.Length != actual.Length)
            {
                return false;
            }

            for (int i = 0; i < expectedRoute.Length; i++)
            {
                if (expectedRoute[i] != actual[i])
                {
                    return false;
                }
            }

            return true;
        }
    }
}