import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ALL_DEPARTMENTS,
  GET_ALL_ROLES,
  GET_ALL_EMPLOYEES,
  GET_ORGANIZATIONAL_HIERARCHY,
} from '../../graphql/organizationalStructure';

const OrganizationalStructureTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'departments' | 'roles' | 'employees' | 'hierarchy'>('departments');

  const { data: departmentsData, loading: departmentsLoading, error: departmentsError } = useQuery(GET_ALL_DEPARTMENTS);
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useQuery(GET_ALL_ROLES);
  const { data: employeesData, loading: employeesLoading, error: employeesError } = useQuery(GET_ALL_EMPLOYEES);
  const { data: hierarchyData, loading: hierarchyLoading, error: hierarchyError } = useQuery(GET_ORGANIZATIONAL_HIERARCHY);

  if (departmentsLoading || rolesLoading || employeesLoading || hierarchyLoading) {
    return <div className="p-6">Loading organizational structure...</div>;
  }

  if (departmentsError || rolesError || employeesError || hierarchyError) {
    return (
      <div className="p-6 text-red-600">
        Error loading organizational structure: {departmentsError?.message || rolesError?.message || employeesError?.message || hierarchyError?.message}
      </div>
    );
  }

  const renderDepartments = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Departments ({departmentsData?.allDepartments?.length || 0})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentsData?.allDepartments?.map((dept: any) => (
          <div key={dept.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900">{dept.name}</h4>
            <p className="text-sm text-gray-600 mt-2">{dept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Roles ({rolesData?.allRoles?.length || 0})</h3>
      <div className="space-y-3">
        {rolesData?.allRoles?.map((role: any) => (
          <div key={role.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{role.title}</h4>
                <p className="text-sm text-gray-600">{role.department?.name}</p>
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                {role.reportsTo && (
                  <div>Reports to: {role.reportsTo.title}</div>
                )}
                {role.subordinates?.length > 0 && (
                  <div>Manages: {role.subordinates.length} roles</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Employees ({employeesData?.allEmployees?.length || 0})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employeesData?.allEmployees?.map((emp: any) => (
          <div key={emp.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900">{emp.name}</h4>
            <p className="text-sm text-gray-600">{emp.email}</p>
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <p className="text-xs font-medium text-gray-700">{emp.role?.title}</p>
              <p className="text-xs text-gray-600">{emp.role?.department?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHierarchy = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Organizational Hierarchy</h3>
      <div className="space-y-4">
        {hierarchyData?.organizationalHierarchy?.map((topRole: any) => (
          <div key={topRole.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-lg font-semibold text-blue-600 mb-2">
              🏭 {topRole.title} - {topRole.department?.name}
            </div>
            <p className="text-sm text-gray-600 mb-3">{topRole.description}</p>

            {topRole.subordinates?.map((deptRole: any) => (
              <div key={deptRole.id} className="ml-6 mb-3 p-3 bg-gray-50 rounded">
                <div className="font-medium text-green-600">
                  📋 {deptRole.title} - {deptRole.department?.name}
                </div>
                <p className="text-sm text-gray-600 mb-2">{deptRole.description}</p>

                {deptRole.subordinates?.map((supRole: any) => (
                  <div key={supRole.id} className="ml-6 mb-2 p-2 bg-blue-50 rounded">
                    <div className="font-medium text-purple-600">
                      👥 {supRole.title}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{supRole.description}</p>

                    {supRole.subordinates?.map((indRole: any) => (
                      <div key={indRole.id} className="ml-6 p-2 bg-yellow-50 rounded">
                        <div className="font-medium text-orange-600">
                          👤 {indRole.title}
                        </div>
                        <p className="text-sm text-gray-600">{indRole.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        🏭 Organizational Structure Test
      </h1>

      <div className="mb-6">
        <nav className="flex space-x-4">
          {[
            { key: 'departments', label: 'Departments', icon: '📋' },
            { key: 'roles', label: 'Roles', icon: '👔' },
            { key: 'employees', label: 'Employees', icon: '👥' },
            { key: 'hierarchy', label: 'Hierarchy', icon: '🏗️' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        {activeTab === 'departments' && renderDepartments()}
        {activeTab === 'roles' && renderRoles()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'hierarchy' && renderHierarchy()}
      </div>
    </div>
  );
};

export default OrganizationalStructureTest;
