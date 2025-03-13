import { gql } from "@apollo/client";

const GET_MY_PROFILE = gql`
  query my_profile {
    my_profile {
      id
      user_id
      email
      has_set_sec_qns
      sys_gen_pwd
      biodata {
        id
        email
        salutation
        surname
        other_names
        telno
      }
      last_logged_in {
        id
        machine_ipaddress
        logged_in
      }
      role {
        id: role_id
        role_name
        # permissions
        _modules {
          id
          title
          route
          logo
        }
      }
    }
  }
`;

const LOAD_GRADUATION_SESSIONS = gql`
  query graduation_sessions {
    graduation_sessions {
      id
      acc_yr_title
      graduation_date
      clearance_start_date
      clearance_deadline
      graduation_venue
      last_modified_by
      last_modified_on
      acc_yr_id
      maximum_attendees
      status
    }
  }
`;

const LOAD_ACTIVE_GRADUATION_SESSION = gql`
  query active_graduation_session {
    active_graduation_session {
      id
      acc_yr_title
      acc_yr_id
      clearance_deadline
      clearance_start_date
      graduation_date
      graduation_venue
      last_modified_by
      last_modified_on
      maximum_attendees
      status
    }
  }
`;

export {
  GET_MY_PROFILE,
  LOAD_GRADUATION_SESSIONS,
  LOAD_ACTIVE_GRADUATION_SESSION,
};
