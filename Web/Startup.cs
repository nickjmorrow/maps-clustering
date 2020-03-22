using Calc;
using Calc.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Warlock.Services;
using Web.Services;
using WebApplication.Services;

namespace WebApplication
{
    public class Startup
    {
        private IConfiguration Configuration { get; }
        private IWebHostEnvironment Environment { get; }
        private readonly string AllowOrigins = "ALLOW_ORIGINS";
        private const string DEV_CONNECTION_STRING = "DEV_CONNECTION_STRING";
        private const string PROD_CONNECTION_STRING = "PROD_CONNECTION_STRING";
        
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(c =>
            {
                c.EnableEndpointRouting = false;
            }).SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            // CORS
            services.AddCors(c =>
            {
                c.AddPolicy(AllowOrigins, options => options
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod());
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
            
            var connectionStringEnvironmentVariableKey =
                Environment.IsDevelopment() ? DEV_CONNECTION_STRING : PROD_CONNECTION_STRING;
            
            var connectionString = System.Environment.GetEnvironmentVariable(connectionStringEnvironmentVariableKey);

            
            services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString));
            services.AddScoped<FileHandlerService, FileHandlerService>();
            services
                .AddScoped<AgglomerativeHierarchicalClusteringService, AgglomerativeHierarchicalClusteringService>();
            services.AddScoped<OrderingService, OrderingService>();
            services.AddScoped<AuthService, AuthService>();
            services.AddScoped<UserItemService, UserItemService>();
            services.AddScoped<ItemService, ItemService>();
            services.AddScoped<PointsGroupService, PointsGroupService>();
            services.AddScoped<ItemFilterer, ItemFilterer>();
            services.AddScoped<FileConversionService, FileConversionService>();
            services.AddScoped<ClusteringService, ClusteringService>();
            services.AddScoped<ClusteringSummaryService, ClusteringSummaryService>();
            services.AddScoped<DistanceService, DistanceService>();
            services.AddScoped<DatabaseSettingProvider, DatabaseSettingProvider>();
            services.AddScoped<TourBridge, TourBridge>();
            services.AddScoped<TourProvider, TourProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseRouting();

            app.UseCors(AllowOrigins);

            app.UseEndpoints(endpoints => { endpoints.MapControllers().RequireCors(AllowOrigins); });
            
            app.UseHttpsRedirection();
            app.UseAuthentication();
            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });
        }
    }
}