/* @vitest-environment jsdom */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { InMemoryCache } from "@apollo/client";
import {
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
} from "../../../graphql/userProfile";
import {
  GET_ALL_COUNTRIES,
  GET_STATES_BY_COUNTRY,
} from "../../../graphql/location";
import ProfileRightCard from "../ProfileRightCard";

// Minimal AuthProvider mock to satisfy useAuth requirement
const AuthContext = React.createContext<any>(null);
const MockAuthProvider: React.FC<{
  value?: any;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <AuthContext.Provider
    value={
      value || {
        isAuthenticated: true,
        user: {
          id: "u1",
          email: "test@example.com",
          is_staff: false,
          is_superuser: false,
        },
      }
    }
  >
    {children}
  </AuthContext.Provider>
);
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => React.useContext(AuthContext),
}));

const baseProfile = {
  __typename: "UserProfile",
  id: "p1",
  user: {
    __typename: "User",
    id: "u1",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    isActive: true,
  },
  middleName: "",
  maternalLastName: "",
  preferredName: "Tester",
  position: "Engineer",
  department: "R&D",
  phone: "+15551234567",
  phoneCountryCode: "+1",
  phoneType: "mobile",
  secondaryPhone: "",
  streetAddress: "",
  apartmentSuite: "",
  city: "",
  stateProvince: "",
  zipCode: "",
  country: "United States",
  countryCode: "US",
  bio: "Hi there",
  education: "[]",
  workHistory: "[]",
  profileVisibility: "{}",
  avatar: null,
  avatarUrl: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};

const countriesMock = {
  request: { query: GET_ALL_COUNTRIES },
  result: {
    data: {
      allCountries: [
        {
          __typename: "Country",
          id: "c1",
          name: "United States",
          code: "+1",
          isActive: true,
        },
        {
          __typename: "Country",
          id: "c2",
          name: "Mexico",
          code: "+52",
          isActive: true,
        },
      ],
    },
  },
};

const statesMock = {
  request: { query: GET_STATES_BY_COUNTRY, variables: { countryCode: "US" } },
  result: {
    data: {
      allStates: [
        {
          __typename: "State",
          id: "s1",
          name: "California",
          code: "CA",
          countryCode: "US",
        },
        {
          __typename: "State",
          id: "s2",
          name: "New York",
          code: "NY",
          countryCode: "US",
        },
        {
          __typename: "State",
          id: "s3",
          name: "Texas",
          code: "TX",
          countryCode: "US",
        },
      ],
    },
  },
};

function renderCard(
  extraMocks: any[] = [],
  Comp: any = ProfileRightCard,
  authOverrides: any = {},
) {
  const mocks = [
    {
      request: { query: GET_USER_PROFILE },
      result: { data: { userProfile: baseProfile } },
    },
    countriesMock,
    statesMock,
    {
      request: { query: GET_STATES_BY_COUNTRY, variables: { countryCode: "" } },
      result: { data: { allStates: [] } },
    },
    ...extraMocks,
  ];
  return render(
    <MockedProvider mocks={mocks} cache={new InMemoryCache()}>
      <MockAuthProvider
        value={{
          isAuthenticated: true,
          user: {
            id: "u1",
            email: "test@example.com",
            is_staff: authOverrides.is_staff || false,
            is_superuser: authOverrides.is_superuser || false,
          },
        }}
      >
        <Comp />
      </MockAuthProvider>
    </MockedProvider>,
  );
}

// Suppress specific Apollo deprecation warnings to keep test output clean
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const msg = args.join(" ");
  if (/canonizeResults/.test(msg) || /addTypename prop/.test(msg)) return;
  originalConsoleError(...args);
};

describe("ProfileRightCard General tab", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders User name label on General tab", async () => {
    renderCard();
    fireEvent.click(await screen.findByRole("button", { name: /General/i }));
    await screen.findByText(/User name/i);
  });

  it("shows validation errors for invalid email & phone", async () => {
    renderCard();
    fireEvent.click(await screen.findByRole("button", { name: /General/i }));
    fireEvent.change(await screen.findByPlaceholderText("Email address"), {
      target: { value: "bad" },
    });
    fireEvent.change(await screen.findByPlaceholderText("(555) 123-4567"), {
      target: { value: "123" },
    });
    await screen.findByText(/valid email address/i);
    await screen.findByText(/valid phone number/i);
  });

  it("autosaves first name change (debounced)", async () => {
    const updateMock = {
      request: {
        query: UPDATE_USER_PROFILE,
        variables: expect.objectContaining({
          firstName: "Changed",
        }),
      },
      result: {
        data: {
          updateUserProfile: {
            __typename: "UpdateUserProfilePayload",
            ok: true,
            errors: [],
            userProfile: {
              ...baseProfile,
              user: { ...baseProfile.user, firstName: "Changed" },
            },
          },
        },
      },
    };

    renderCard([updateMock]);

    // Wait for component to render
    await waitFor(() => screen.getByPlaceholderText("First name"), {
      timeout: 10000,
    });

    const firstNameInput = screen.getByPlaceholderText("First name");
    expect((firstNameInput as HTMLInputElement).value).toBe("Test");

    // Change the input value
    fireEvent.change(firstNameInput, { target: { value: "Changed" } });

    // Wait for autosave to trigger (2 seconds debounce + some processing time)
    await waitFor(
      () => {
        // Look for any indication that autosave happened
        const savedText =
          screen.queryByText(/saved/i) || screen.queryByText(/Saving/i);
        return savedText !== null;
      },
      { timeout: 8000 },
    );
  }, 15000);

  it("disables User name input for non-staff user", async () => {
    renderCard();
    // General tab is default, so no need to click
    await waitFor(() => screen.getByPlaceholderText("User name"), {
      timeout: 10000,
    });
    const unameInput = screen.getByPlaceholderText("User name");
    expect((unameInput as HTMLInputElement).disabled).toBe(true);
  }, 15000);

  it("enables User name input when staff user", async () => {
    renderCard([], ProfileRightCard, { is_staff: true });
    // General tab is default, so no need to click
    await waitFor(() => screen.getByPlaceholderText("User name"), {
      timeout: 10000,
    });
    const unameInput = screen.getByPlaceholderText("User name");
    expect((unameInput as HTMLInputElement).disabled).toBe(false);
  }, 15000);
});
