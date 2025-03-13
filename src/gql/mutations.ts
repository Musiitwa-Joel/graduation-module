import { gql } from "@apollo/client";

const SAVE_GRADUATION_SESSION = gql`
  mutation saveGraduationSession($payload: GraduationSessionInput) {
    saveGraduationSession(payload: $payload) {
      message
      success
    }
  }
`;

export { SAVE_GRADUATION_SESSION };
