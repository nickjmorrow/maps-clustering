namespace WebApplication.Helpers
{
    public class AppSettings
    {
        public string DevelopmentConnectionString { get; set; }
        public string ProductionConnectionString { get; set; }
        public string Secret { get; set; }
        public string GoogleClientId { get; set; }
        public string GoogleClientSecret { get; set; }
    }
}    