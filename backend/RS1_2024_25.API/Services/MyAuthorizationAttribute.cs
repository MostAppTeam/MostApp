using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using RS1_2024_25.API.Services;
using System;

namespace RS1_2024_25.API.Helper.Auth
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class MyAuthorizationAttribute : Attribute, IAuthorizationFilter
    {
        private readonly bool _isAdmin;
        private readonly bool _isManager;

        public MyAuthorizationAttribute(bool isAdmin, bool isManager)
        {
            _isAdmin = isAdmin;
            _isManager = isManager;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var authService = context.HttpContext.RequestServices.GetService<MyAuthService>();
            if (authService == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var authInfo = authService.GetAuthInfo();
            if (authInfo == null || !authInfo.IsLoggedIn)
            {
                Console.WriteLine("Korisnik nije prijavljen ili token nije validan.");
                context.Result = new UnauthorizedResult();
                return;
            }


            if (_isAdmin && !authInfo.IsAdmin)
            {
                context.Result = new ForbidResult();
                return;
            }

            if (_isManager && !authInfo.IsManager)
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}