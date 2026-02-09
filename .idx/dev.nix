{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [ pkgs.nodejs_20 pkgs.git ];
  env = { NODE_ENV = "development"; NEXT_PUBLIC_APP_URL = "http://localhost:3000"; };
  idx = {
    extensions = [ "bradlc.vscode-tailwindcss" "esbenp.prettier-vscode" "yoavbls.pretty-ts-errors" ];
    workspace = {
      onCreate = { 
        npm-install = "npm ci --no-audit --prefer-offline --no-progress || npm install";
        default.openFiles = [ "rules.md" "src/app/page.tsx" ];
      };
      onStart = { git-init = "git init 2>/dev/null || true"; };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}
