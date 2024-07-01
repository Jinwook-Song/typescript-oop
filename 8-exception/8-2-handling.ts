{
  class TimeoutError extends Error {}
  class OfflineError extends Error {}

  class NetworkClient {
    tryConnect(): void {
      throw new OfflineError('no network!');
    }
  }

  class UserService {
    constructor(private client: NetworkClient) {}

    login() {
      this.client.tryConnect();
    }
  }

  class App {
    constructor(private userService: UserService) {}
    run() {
      try {
        this.userService.login();
      } catch (error) {
        // show dialog to use
      }
    }
  }

  const client = new NetworkClient();
  const service = new UserService(client);
  const app = new App(service);
  app.run();
}

/**
 * Notes:
 * error를 처리할때, 어디에서 처리할지에 대한 고민
 * 가장 우아하게 처리할 수 있는곳.
 * 예시에서는 가장 가까운 UserService가 아니라 App 단에서 처리해서, dialog로 안내할 수 있다.
 */
