{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      pkgs = nixpkgs.legacyPackages."x86_64-linux";
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          prisma-engines
          prisma
          openssl
          nodejs_22
          docker-compose
        ];

        shellHook = ''
          export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig";
          export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
          export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
        '';
      };
    };
}
