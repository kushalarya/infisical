import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { createNotification } from "@app/components/notifications";
import { localStorageService } from "@app/helpers/localStorage";

import { GitlabOAuthCallbackPageQueryParamsSchema } from "./GitlabOauthCallbackPage/route";

export const Route = createFileRoute(
  "/_authenticate/_inject-org-details/integrations/gitlab/oauth2/callback"
)({
  validateSearch: zodValidator(GitlabOAuthCallbackPageQueryParamsSchema),
  beforeLoad: ({ search }) => {
    const projectId = localStorageService.getIintegrationProjectId();
    if (!projectId) {
      createNotification({
        type: "error",
        title: "Missing project id",
        text: "Please retry integration"
      });
      throw redirect({ to: "/organization/secret-manager/overview" });
    }
    throw redirect({
      to: "/secret-manager/$projectId/integrations/gitlab/oauth2/callback",
      params: { projectId },
      search
    });
  }
});