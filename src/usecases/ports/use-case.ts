export interface UseCase<Input, Output> {
  perform (request: Input): Promise<Output>
}
