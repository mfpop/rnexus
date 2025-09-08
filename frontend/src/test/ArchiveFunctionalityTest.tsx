import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Archive, ArchiveRestore, MessageSquare, Users, CheckCircle, XCircle } from 'lucide-react';

interface TestResult {
  id: string;
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: Date;
}

const ArchiveFunctionalityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testUserId, setTestUserId] = useState<string>('1');

  const addTestResult = (test: string, status: 'pending' | 'success' | 'error', message: string) => {
    const result: TestResult = {
      id: Date.now().toString(),
      test,
      status,
      message,
      timestamp: new Date(),
    };
    setTestResults(prev => [result, ...prev]);
  };

  const testArchiveChat = async () => {
    setIsLoading(true);
    addTestResult('Archive Chat', 'pending', 'Testing archive functionality...');

    try {
      // Simulate GraphQL mutation call
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ArchiveChat($user_id: Int!) {
              archiveChat(userId: $user_id) {
                success
                message
              }
            }
          `,
          variables: {
            user_id: parseInt(testUserId),
          },
        }),
      });

      const data = await response.json();

      if (data.data?.archiveChat?.success) {
        addTestResult('Archive Chat', 'success', data.data.archiveChat.message);
      } else {
        addTestResult('Archive Chat', 'error', data.data?.archiveChat?.message || 'Archive failed');
      }
    } catch (error) {
      addTestResult('Archive Chat', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testUnarchiveChat = async () => {
    setIsLoading(true);
    addTestResult('Unarchive Chat', 'pending', 'Testing unarchive functionality...');

    try {
      // Simulate GraphQL mutation call
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UnarchiveChat($user_id: Int!) {
              unarchiveChat(userId: $user_id) {
                success
                message
              }
            }
          `,
          variables: {
            user_id: parseInt(testUserId),
          },
        }),
      });

      const data = await response.json();

      if (data.data?.unarchiveChat?.success) {
        addTestResult('Unarchive Chat', 'success', data.data.unarchiveChat.message);
      } else {
        addTestResult('Unarchive Chat', 'error', data.data?.unarchiveChat?.message || 'Unarchive failed');
      }
    } catch (error) {
      addTestResult('Unarchive Chat', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Archive className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Archive Functionality Test</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Test Controls</span>
            </CardTitle>
            <CardDescription>
              Test the archive and unarchive functionality with different user IDs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Test User ID</Label>
              <Input
                id="userId"
                type="number"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                placeholder="Enter user ID to test with"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={testArchiveChat}
                disabled={isLoading || !testUserId}
                className="flex items-center space-x-2"
              >
                <Archive className="h-4 w-4" />
                <span>Test Archive</span>
              </Button>

              <Button
                onClick={testUnarchiveChat}
                disabled={isLoading || !testUserId}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArchiveRestore className="h-4 w-4" />
                <span>Test Unarchive</span>
              </Button>
            </div>

            <Button
              onClick={clearResults}
              variant="ghost"
              className="w-full"
            >
              Clear Results
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Test Results</span>
            </CardTitle>
            <CardDescription>
              View the results of your archive functionality tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No test results yet. Run some tests to see results here.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{result.test}</p>
                          <p className="text-xs text-gray-500">
                            {result.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Archive Test:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Enter a valid user ID</li>
                <li>• Click "Test Archive"</li>
                <li>• Verify success message</li>
                <li>• Check that chat is archived</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Unarchive Test:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use the same user ID</li>
                <li>• Click "Test Unarchive"</li>
                <li>• Verify success message</li>
                <li>• Check that chat is unarchived</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchiveFunctionalityTest;
