using Microsoft.AspNetCore.Http;

namespace WebApplication.Models.DTOs
{
    public class PointsGroupFileInput
    {
        public IFormFile File { get; set; }
        public string Name { get; set; }
    }
}